import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminUsers, updateUserRole } from "@/lib/actions/admin-actions";
import { redirect } from "next/navigation";
import {
    ShieldAlert,
    UserCheck,
    UserPlus,
    UserMinus,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";
import RoleBadge from "@/components/admin/RoleBadge";
import UserRoleActions from "@/components/admin/UserRoleActions";
import { cn } from "@/lib/utils";
import CreateUserModal from "@/components/admin/CreateUserModal";
import { DESIGNATIONS } from "@/lib/constants/designations";

export default async function PersonnelRegistry() {
    const session = await getServerSession(authOptions);

    // Server-side security check
    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin/");
    }

    const users = await getAdminUsers();

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[#22D3EE]">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Master Administrator Control</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic pb-1">
                        <span className="text-[#22D3EE]">Institutional</span> <span className="text-[#F1F5F9]">Access Registry</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl font-medium tracking-tight">
                        Institutional oversight of all registered personnel. Authorize strategic analyst status and calibrate editorial oversight clearance.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                        <input
                            type="text"
                            placeholder="Search Personnel Email..."
                            className="pl-10 pr-4 h-11 w-64 bg-[#020617] border border-[#1E293B] rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#22D3EE] transition-all outline-none text-[#F1F5F9] placeholder:text-[#475569]"
                        />
                    </div>
                    <CreateUserModal />
                </div>
            </div>

            {/* Personnel Table */}
            <div className="bg-[#020617] border border-[#1E293B] rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#020617]/50 border-b border-[#1E293B]">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Institutional Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Credentials</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Clearance Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Personnel Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-[#020617]/80 transition-colors border-b border-[#1E293B]">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center font-bold text-slate-400 text-xs border border-slate-200 dark:border-[#334155]">
                                                {user.email?.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#F1F5F9] uppercase tracking-tight">{user.name || "Anonymous Analyst"}</span>
                                                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]/60">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-[#F1F5F9]">
                                                    {(user as any).designation || "Unknown Designation"}
                                                </span>
                                                {(user as any).designation && !Object.values(DESIGNATIONS).flat().includes((user as any).designation) && (
                                                    <div className="group relative flex items-center justify-center h-4 w-4 rounded-full bg-accent-red/20 text-accent-red cursor-help" title="Manual Review Required: Custom Designation">
                                                        <ShieldAlert className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                                at {(user as any).affiliation || "Unspecified Affiliation"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${(user as any).isApproved ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-red-500 shadow-[0_0_8px_red]'}`} />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                (user as any).isApproved ? "text-[#22D3EE]" : "text-red-500"
                                            )}>
                                                {(user as any).isApproved ? 'AUTHORIZED' : 'PENDING'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <UserRoleActions userId={user.id} currentRole={user.role} isApproved={(user as any).isApproved} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Institutional Footer */}
            <div className="flex items-center justify-between px-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-600 leading-relaxed">
                    Institutional Integrity Framework Active — <br /> All personnel calibration is logged for audit purposes.
                </p>
                <div className="flex items-center space-x-2 text-[#22D3EE]">
                    <span className="text-[9px] font-black uppercase tracking-widest">System Health: 100%</span>
                    <div className="h-1 w-8 bg-slate-200 dark:bg-[#1E293B] rounded-full overflow-hidden">
                        <div className="h-full w-full bg-[#22D3EE]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
