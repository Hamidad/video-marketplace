// Mock state for unlocked profiles
// In a real app, this would be in the database
const unlockedProfiles: Set<string> = new Set();

export const unlockService = {
    isUnlocked: (seekerId: string): boolean => {
        return unlockedProfiles.has(seekerId);
    },

    unlockProfile: async (seekerId: string, method: 'PAYMENT' | 'APPLICATION'): Promise<boolean> => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        unlockedProfiles.add(seekerId);
        return true;
    },

    // For testing purposes
    reset: () => {
        unlockedProfiles.clear();
    }
};
