import React, { useMemo, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { employeeService } from '../services/employeeService';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();

    const initials = useMemo(() => {
        const n = user?.name?.trim() || 'User';
        return n.charAt(0).toUpperCase();
    }, [user?.name]);

    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        const nextName = name.trim();
        if (!nextName) {
            addToast('error', 'Name cannot be empty');
            return;
        }

        setIsSaving(true);
        try {
            // Update via API
            await employeeService.updateEmployee(user.id, { name: nextName });
            // Update local auth state
            updateUser({ name: nextName });
            addToast('success', 'Profile updated');
        } catch (error) {
            console.error('Failed to update profile:', error);
            addToast('error', 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Profile</h1>
                    <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                        View and update your account details
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xl font-semibold">
                            {initials}
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-secondary-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">{user?.email}</p>
                        </div>
                        <div className="text-sm px-3 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-300 w-fit">
                            {user?.role}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                        <Input label="Email" value={user?.email || ''} disabled />
                        <Input label="Role" value={user?.role || ''} disabled />
                        <Input label="Organization" value={user?.organizationName || ''} disabled />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleSave} disabled={!user || isSaving} isLoading={isSaving}>
                            Save changes
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
