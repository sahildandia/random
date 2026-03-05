import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    LogOut, 
    Plus, 
    Search, 
    Download, 
    X, 
    Edit2, 
    Trash2, 
    Save,
    Menu,
    MapPin,
    Link as LinkIcon,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// --- Participant Table Component ---
const ParticipantTable = ({ participants, searchTerm, setSearchTerm, deleteParticipant }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 1. Process Data: Flatten teams into individual member rows
    // We need to keep track of groupings for rowSpan
    
    // Helper to parse "Member (Reg) - Email" string if stored that way
    // Current storage: members = "Name (Reg) - Email, Name2 (Reg2) - Email2"
    const parseMembers = (membersStr) => {
        if (!membersStr) return [];
        return membersStr.split(', ').map(m => {
            // Rough parsing, assumes format "Name (Reg) - Email" or "Name (Reg)"
            const regMatch = m.match(/\((.*?)\)/);
            const reg = regMatch ? regMatch[1] : '';
            const name = m.split('(')[0].trim();
            // Extract email after " - "
            const emailParts = m.split(' - ');
            const email = emailParts.length > 1 ? emailParts[1] : '';
            
            return { name, reg, email };
        });
    };

    const processData = () => {
        let processedRows = [];
        let serialNumber = 1;

        // Filter first
        const filtered = participants.filter(p => 
            (p.teamName && p.teamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.registrationNumber && p.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filtered.forEach(p => {
            const teamMembers = parseMembers(p.members);
            const totalRows = 1 + teamMembers.length; // Lead + Members

            // Push Leader Row
            processedRows.push({
                isLeader: true,
                isFirstRow: true,
                rowSpan: totalRows,
                sNo: serialNumber,
                
                teamName: p.teamName || 'N/A',
                role: 'Team Leader',
                name: p.name,
                mobile: p.phone,
                email: p.email,
                rollNumber: p.registrationNumber,

                originalId: p.id // For deletion
            });

            // Push Member Rows
            teamMembers.forEach(m => {
                 processedRows.push({
                    isLeader: false,
                    isFirstRow: false,
                    // Shared Group Data (but not rendered due to rowSpan)
                    sNo: serialNumber,
                    teamName: p.teamName || 'N/A',
                    
                    role: 'Team Member',
                    name: m.name,
                    mobile: '-', // Usually only lead phone is collected
                    email: m.email || '-',
                    rollNumber: m.reg,
                     
                    originalId: p.id
                 });
            });
            
            serialNumber++;
        });

        return processedRows;
    };

    const tableData = processData();

    // Pagination Logic
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    // Note: Pagination needs to be careful not to break rowSpans across pages.
    // For simplicity, we might page by "Teams" instead of rows, but let's stick to simple strict row slicing for now
    // CAUTION: If a group is split across pages, rowSpan will break. 
    // BETTER APPROACH: Page by "Groups" (Original Participants)
    
    const totalGroups = participants.length; // Or filtered groups
    // actually let's reimplement pagination based on *Filtered Participants* (Groups)
    
    // Re-filter source first
    const filteredParticipants = participants.filter(p => 
        (p.teamName && p.teamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.registrationNumber && p.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const totalFilteredGroups = filteredParticipants.length;
    const totalGroupPages = Math.ceil(totalFilteredGroups / itemsPerPage);
    const paginatedGroups = filteredParticipants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Now process ONLY the paginated groups to generate rows
    // This ensures groups stay intact on one page
    const getPaginatedRows = () => {
        let rows = [];
        // Calculate starting S.No based on page
        let sNo = (currentPage - 1) * itemsPerPage + 1;

        paginatedGroups.forEach(p => {
            const teamMembers = parseMembers(p.members);
            const totalRows = 1 + teamMembers.length;

            rows.push({
                isFirstRow: true,
                rowSpan: totalRows,
                sNo: sNo,
                teamName: p.teamName || 'N/A',
                role: 'Team Leader',
                name: p.name,
                mobile: p.phone,
                email: p.email,
                rollNumber: p.registrationNumber,
                id: p.id
            });

            teamMembers.forEach(m => {
                rows.push({
                    isFirstRow: false,
                    role: 'Team Member',
                    name: m.name,
                    mobile: '-',
                    email: m.email || '-',
                    rollNumber: m.reg,
                    id: p.id 
                });
            });
            sNo++;
        });
        return rows;
    };

    const currentRows = getPaginatedRows();


    const handleExport = () => {
        // Prepare Data with merged cells logic needs careful construction
        // But for simple array_to_sheet, we just flatten it and use nulls for merged cells if we want standard behaviour, 
        // OR we just repeat data. 
        // User requested: "Team Name and S.No should be grouped visually (merge cells in Excel)"
        
        // We construct a workbook manually
        const wb = XLSX.utils.book_new();
        
        // Define Headers
        const headers = ["S.No", "Team Name", "Role", "Candidate's Name", "Mobile", "Email", "Roll Number"];
        
        const data = [];
        data.push(headers);

        const merges = [];
        let currentRowIndex = 1; // Start after header

        // Use filteredParticipants (all, not just current page)
        let sNo = 1;
        filteredParticipants.forEach(p => {
             const teamMembers = parseMembers(p.members);
             const totalRows = 1 + teamMembers.length;
             
             // Leader Row
             data.push([
                 sNo,
                 p.teamName,
                 "Team Leader",
                 p.name,
                 p.phone,
                 p.email,
                 p.registrationNumber
             ]);

             // Member Rows
             teamMembers.forEach(m => {
                 data.push([
                     null, // S.No merged
                     null, // Team Name merged
                     "Team Member",
                     m.name,
                     "-",
                     m.email || "-",
                     m.reg
                 ]);
             });

             // Add Merge config
             if (totalRows > 1) {
                 // Merge S.No (Col 0)
                 merges.push({ s: { r: currentRowIndex, c: 0 }, e: { r: currentRowIndex + totalRows - 1, c: 0 } });
                 // Merge Team Name (Col 1)
                 merges.push({ s: { r: currentRowIndex, c: 1 }, e: { r: currentRowIndex + totalRows - 1, c: 1 } });
             }

             currentRowIndex += totalRows;
             sNo++;
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        ws['!merges'] = merges;
        
        // Auto width (basic)
        const wscols = headers.map(h => ({wch: h.length + 5}));
        ws['!cols'] = wscols;

        XLSX.utils.book_append_sheet(wb, ws, "Participants");
        
        const dateStr = new Date().toISOString().split('T')[0];
        // Requirement: participants_report_date.xlsx
        XLSX.writeFile(wb, `participants_report_${dateStr}.xlsx`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Participants Report</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Team / Name / Reg No..." 
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset page on search
                            }}
                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-purple w-full sm:w-80"
                        />
                    </div>
                    <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 font-medium">
                        <Download size={18} /> Export to Excel
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-[#e8f5e9] dark:bg-green-900/20 text-slate-800 dark:text-slate-200 uppercase tracking-wider font-bold border-b-2 border-slate-300 dark:border-slate-600">
                            <tr>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">S.No</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Team Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Role</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Candidate's Name</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Mobile</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Email</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700">Roll Number</th>
                                <th className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {currentRows.length > 0 ? (
                                currentRows.map((row, idx) => (
                                    <tr key={`${row.id}-${idx}`} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${row.isFirstRow ? 'border-t-2 border-slate-200 dark:border-slate-700' : ''}`}>
                                        
                                        {/* S.No - RowSpan */}
                                        {row.isFirstRow && (
                                            <td rowSpan={row.rowSpan} className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium text-center align-middle bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-200">
                                                {row.sNo}
                                            </td>
                                        )}

                                        {/* Team Name - RowSpan */}
                                        {row.isFirstRow && (
                                            <td rowSpan={row.rowSpan} className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-bold align-middle bg-slate-50/50 dark:bg-white/5 text-electric-purple">
                                                {row.teamName}
                                            </td>
                                        )}

                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium">
                                            <span className={`px-2 py-1 rounded text-xs ${row.role === 'Team Leader' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                {row.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-medium whitespace-nowrap text-slate-900 dark:text-slate-200">{row.name}</td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-400">{row.mobile}</td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-400">{row.email}</td>
                                        <td className="px-4 py-3 border border-slate-200 dark:border-slate-700 font-mono text-xs text-electric-purple">{row.rollNumber}</td>
                                        
                                        {/* Action - RowSpan (Merge delete button for entire team) */}
                                        {row.isFirstRow && (
                                            <td rowSpan={row.rowSpan} className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-center align-middle">
                                                <button 
                                                    onClick={() => {
                                                        if(window.confirm(`Delete Team "${row.teamName}" and all its members?`)) {
                                                            deleteParticipant(row.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mx-auto block"
                                                    title="Delete Team"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        No participants found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalFilteredGroups > 0 && (
                     <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/5">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalFilteredGroups)}</span> of <span className="font-medium">{totalFilteredGroups}</span> teams
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-300 dark:border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-white/5 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="flex items-center px-4 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg">
                                Page {currentPage} of {totalGroupPages || 1}
                            </span>
                             <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalGroupPages))}
                                disabled={currentPage === totalGroupPages}
                                className="p-2 border border-slate-300 dark:border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-white/5 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const { isAdmin, logout, upcomingEvents, addUpcomingEvent, updateUpcomingEvent, deleteUpcomingEvent, participants, deleteParticipant } = useEvents();
    const navigate = useNavigate();
    
    // Check initial screen size for sidebar state
    const [activeTab, setActiveTab] = useState('overview'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(null);

    // Close sidebar on mobile when navigating
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        image: '',
        registrationLink: ''
    });

    if (!isAdmin) {
        navigate('/admin');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    // Filter participants based on search
    const filteredParticipants = participants?.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Stats
    const totalEvents = upcomingEvents?.length || 0;
    const totalParticipants = participants?.length || 0;
    const recentRegistrations = [...(participants || [])].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 5);

    // Handlers
    const handleAddSubmit = (e) => {
        e.preventDefault();
        addUpcomingEvent({
            ...formData,
            // Assuming simplified date handling for now
            dateTarget: new Date(formData.date).toISOString() 
        });
        setShowAddModal(false);
        setFormData({ title: '', date: '', location: '', description: '', image: '', registrationLink: '' });
    };

    const startEdit = (event) => {
        setIsEditing(event.id);
        setFormData(event);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setFormData({ title: '', date: '', location: '', description: '', image: '', registrationLink: '' });
    };

    const saveEdit = (id) => {
        updateUpcomingEvent(id, formData);
        setIsEditing(null);
        setFormData({ title: '', date: '', location: '', description: '', image: '', registrationLink: '' });
    };

    const downloadParticipants = () => {
        if (!participants || participants.length === 0) {
            alert("No participants to download.");
            return;
        }
        const dataToExport = participants.map(p => ({
            "Full Name": p.name,
            "Reg. Number": p.registrationNumber,
            "Email": p.email,
            "Phone": p.phone,
            "Event": p.event,
            "Department": p.department,
            "Year": p.year,
            "Team": p.teamName || "N/A",
            "Members": p.members || "N/A",
            "Date": new Date(p.registeredAt).toLocaleDateString()
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
        saveAs(data, `participants_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // Components
    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button 
            onClick={() => handleTabChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === id 
                ? 'bg-electric-purple text-white shadow-lg shadow-electric-purple/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
        >
            <Icon size={20} />
            <span className={`font-medium ${!isSidebarOpen && 'hidden md:hidden'}`}>{label}</span>
        </button>
    );

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</div>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex transition-colors duration-300 relative">
             {/* Mobile Overlay */}
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-white/5 transition-transform duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'} `}>
                <div className="h-full flex flex-col p-4">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-electric-purple flex items-center justify-center shrink-0">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className={`font-bold text-xl text-slate-900 dark:text-white transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0 md:hidden'}`}>Admin</span>
                    </div>

                    <nav className="space-y-2 flex-1">
                        <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
                        <SidebarItem id="events" icon={Calendar} label="Events" />
                        <SidebarItem id="participants" icon={Users} label="Participants" />
                    </nav>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors mt-auto"
                    >
                        <LogOut size={20} />
                         <span className={`font-medium transition-opacity duration-200 ${!isSidebarOpen && 'md:opacity-0 md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg md:hidden">
                        <Menu size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-600 dark:text-slate-300">
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Welcome, Admin
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            {/* Avatar placeholder */}
                            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" />
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    {/* Content Views */}
                    
                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard title="Total Events" value={totalEvents} icon={Calendar} color="bg-blue-500" />
                                <StatCard title="Total Participants" value={totalParticipants} icon={Users} color="bg-emerald-500" />
                                <StatCard title="New Registrations (Today)" value={recentRegistrations.filter(r => new Date(r.registeredAt).toDateString() === new Date().toDateString()).length} icon={Users} color="bg-violet-500" />
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Registrations</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Name</th>
                                                <th className="px-4 py-3">Event</th>
                                                <th className="px-4 py-3 rounded-r-lg">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {recentRegistrations.map((p, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.event}</td>
                                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-500">{new Date(p.registeredAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {recentRegistrations.length === 0 && (
                                                <tr><td colSpan="3" className="px-4 py-4 text-center text-slate-500">No recent activity</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EVENTS */}
                    {activeTab === 'events' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
                                <button onClick={() => setShowAddModal(true)} className="bg-electric-purple text-white px-4 py-2 rounded-lg hover:bg-electric-purple/90 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-electric-purple/20">
                                    <Plus size={18} /> New Event
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                        {/* Image Area */}
                                        <div className="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                            {event.image ? (
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                            )}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(event)} className="p-2 bg-white/90 hover:bg-white rounded-lg text-blue-600 shadow-sm"><Edit2 size={16} /></button>
                                                <button onClick={() => deleteUpcomingEvent(event.id)} className="p-2 bg-white/90 hover:bg-white rounded-lg text-red-600 shadow-sm"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        
                                        {isEditing === event.id ? (
                                            <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50">
                                                <input className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title" />
                                                <input className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="Date" />
                                                <textarea className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Desc" />
                                                <div className="flex gap-2 justify-end mt-2">
                                                    <button onClick={cancelEdit} className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                                                    <button onClick={() => saveEdit(event.id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{event.title}</h3>
                                                </div>
                                                <div className="flex flex-col gap-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-2"><Calendar size={14} /> {event.date}</div>
                                                    <div className="flex items-center gap-2"><MapPin size={14} /> {event.location}</div>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">{event.description}</p>
                                                {event.registrationLink && (
                                                    <a href={event.registrationLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-medium text-electric-purple hover:underline">
                                                        <LinkIcon size={12} /> Registration Link
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PARTICIPANTS */}
                    {activeTab === 'participants' && <ParticipantTable participants={participants} searchTerm={searchTerm} setSearchTerm={setSearchTerm} deleteParticipant={deleteParticipant} />}
                </div>
            </main>

            {/* Add Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-white/10 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Event</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                    <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="e.g. 15 March" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                                    <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Venue" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                    rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                    value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Link</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-electric-purple focus:outline-none" 
                                    value={formData.registrationLink} onChange={e => setFormData({...formData, registrationLink: e.target.value})} placeholder="https://forms..." />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-medium">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-electric-purple text-white rounded-lg hover:bg-electric-purple/90 transition-colors font-bold shadow-lg shadow-electric-purple/20">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
