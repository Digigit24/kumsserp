
import React, { createContext, ReactNode, useContext, useState } from 'react';
import TetrisLoader from '../components/ui/tetris-loader';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoader, hideLoader }}>
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
                    <TetrisLoader
                        size="sm"
                        speed="slow"
                        activeColor="bg-black dark:bg-white"
                        settledColor="bg-black/50 dark:bg-white/50"
                        gridColor="bg-gray-200/50 dark:bg-gray-800/50"
                    />
                </div>
            )}
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
