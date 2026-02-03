import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { employeeService } from '../services/employeeService';
import type { Employee, User } from '../types';

type AccessRole = User['role'];

export const Settings: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();

    const isAdmin = user?.role === 'Admin';
    const canManageRoles = isAdmin;

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<AccessRole>('Employee');

    // Fetch employees from API
    const fetchEmployees = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await employeeService.getEmployees();
            setEmployees(data);
            if (data.length > 0 && !selectedEmployeeId) {
                setSelectedEmployeeId(data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            addToast('error', 'Failed to load employees');
        } finally {
            setIsLoading(false);
        }
    }, [addToast, selectedEmployeeId]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Update selected role when employee changes
    useEffect(() => {
        const emp = employees.find((e) => e.id === selectedEmployeeId);
        if (emp) {
            // accessRole might be stored in the employee object or we can get it from backend
            // For now, using the role field which maps to accessRole
            setSelectedRole((emp as any).accessRole || 'Employee');
        }
    }, [selectedEmployeeId, employees]);

    const selectedEmployee = useMemo(
        () => employees.find((e) => e.id === selectedEmployeeId),
        [employees, selectedEmployeeId]
    );

    const roleCounts = useMemo(() => {
        const counts: Record<AccessRole, number> = { Admin: 0, Manager: 0, Employee: 0 };
        for (const e of employees) {
            const r = (e as any).accessRole || 'Employee';
            counts[r] = (counts[r] || 0) + 1;
        }
        return counts;
    }, [employees]);

    const handleAssign = async () => {
        if (!canManageRoles) {
            addToast('error', 'Only Admins can assign roles');
            return;
        }
        if (!selectedEmployee) return;

        setIsSaving(true);
        try {
            // Update employee's accessRole via API
            await employeeService.updateEmployee(selectedEmployee.id, {
                accessRole: selectedRole,
            } as any);

            // Update local state
            setEmployees((prev) =>
                prev.map((e) =>
                    e.id === selectedEmployee.id ? { ...e, accessRole: selectedRole } as any : e
                )
            );

            // If updating own role, refresh auth context
            if (user?.id === selectedEmployee.id) {
                updateUser({ role: selectedRole });
            }

            addToast('success', 'Role assigned successfully');
        } catch (error) {
            console.error('Failed to assign role:', error);
            addToast('error', 'Failed to assign role');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Settings</h1>
                    <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        Manage roles and admin access
                    </p>
                </div>

                {employees.length === 0 ? (
                    <EmptyState
                        title="No employees found"
                        description="Add employees first, then assign roles here."
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-6 space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                    Role assignment
                                </h2>
                                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                                    Select an employee and assign Admin/Manager/Employee access.
                                </p>
                                {!canManageRoles && (
                                    <p className="mt-2 text-sm text-warning-700 dark:text-warning-300">
                                        You don&apos;t have permission to change roles. Ask an Admin.
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="px-3 py-2 rounded-lg bg-surface dark:bg-slate-900 border border-border dark:border-slate-700">
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">ADMINS</p>
                                    <p className="text-lg font-semibold text-secondary-900 dark:text-white">{roleCounts.Admin}</p>
                                </div>
                                <div className="px-3 py-2 rounded-lg bg-surface dark:bg-slate-900 border border-border dark:border-slate-700">
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">MANAGERS</p>
                                    <p className="text-lg font-semibold text-secondary-900 dark:text-white">{roleCounts.Manager}</p>
                                </div>
                                <div className="px-3 py-2 rounded-lg bg-surface dark:bg-slate-900 border border-border dark:border-slate-700">
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">EMPLOYEES</p>
                                    <p className="text-lg font-semibold text-secondary-900 dark:text-white">{roleCounts.Employee}</p>
                                </div>
                            </div>
                        </div>

                        {/* Assign UI (dropdown) */}
                        <div className="border border-border dark:border-slate-700 rounded-lg p-4 bg-surface dark:bg-slate-900">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Employee
                                    </label>
                                    <select
                                        value={selectedEmployeeId}
                                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                        className="w-full px-4 py-2 text-base border border-border rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    >
                                        {employees.map((e) => (
                                            <option key={e.id} value={e.id}>
                                                {e.name} — {e.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Role
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value as AccessRole)}
                                        className="w-full px-4 py-2 text-base border border-border rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        disabled={!canManageRoles}
                                    >
                                        <option value="Employee">Employee</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex items-end justify-end">
                                    <Button
                                        onClick={handleAssign}
                                        disabled={!canManageRoles || !selectedEmployee || isSaving}
                                        isLoading={isSaving}
                                    >
                                        Assign role
                                    </Button>
                                </div>
                            </div>

                            {selectedEmployee ? (
                                <p className="mt-3 text-xs text-secondary-600 dark:text-secondary-400">
                                    Selected: <span className="font-medium">{selectedEmployee.name}</span> ({selectedEmployee.email})
                                </p>
                            ) : null}
                        </div>

                        {/* Current assignments */}
                        <div className="overflow-hidden rounded-lg border border-border dark:border-slate-700">
                            <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-surface dark:bg-slate-900 text-xs font-semibold text-secondary-600 dark:text-secondary-300">
                                <div className="col-span-5">EMPLOYEE</div>
                                <div className="col-span-5">EMAIL</div>
                                <div className="col-span-2">ROLE</div>
                            </div>
                            <div className="divide-y divide-border dark:divide-slate-700 bg-white dark:bg-slate-800">
                                {employees.map((e) => {
                                    const role = (e as any).accessRole || 'Employee';
                                    const isMe = user?.id === e.id;
                                    return (
                                        <div key={e.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                                            <div className="col-span-5 min-w-0">
                                                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                                                    {e.name}
                                                    {isMe ? (
                                                        <span className="ml-2 text-xs font-semibold text-primary-700 dark:text-primary-300">
                                                            (you)
                                                        </span>
                                                    ) : null}
                                                </p>
                                            </div>
                                            <div className="col-span-5 min-w-0">
                                                <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate">{e.email}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <span className={`text-sm px-2 py-1 rounded-md ${
                                                    role === 'Admin'
                                                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300'
                                                        : role === 'Manager'
                                                        ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300'
                                                        : 'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-300'
                                                }`}>
                                                    {role}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
