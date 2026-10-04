import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedListDemo = () => {
    // Generate a large list of items
    const items = useMemo(() => {
        return Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: `Item ${i + 1}`,
            description: `This is description for item ${i + 1}`,
            timestamp: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString(),
        }));
    }, []);

    const parentRef = React.useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">TanStack Virtual Demo</h1>
                <p className="text-gray-600 mb-6">Rendering {items.length.toLocaleString()} items efficiently</p>

                <div
                    ref={parentRef}
                    className="border-2 border-gray-300 rounded-lg overflow-auto bg-white"
                    style={{ height: '600px' }}
                >
                    <div style={{ height: `${totalSize}px` }} className="relative">
                        {virtualItems.map((virtualItem) => {
                            const item = items[virtualItem.index];
                            return (
                                <div
                                    key={virtualItem.key}
                                    className="absolute w-full px-4 py-3 border-b border-gray-200 hover:bg-blue-50 transition-colors"
                                    style={{
                                        transform: `translateY(${virtualItem.start}px)`,
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{item.timestamp}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                    <p className="font-semibold mb-2">Why Virtualization?</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Only visible items are rendered to the DOM</li>
                        <li>Smooth scrolling with 10,000+ items</li>
                        <li>Significantly reduced memory usage</li>
                        <li>Better performance on low-end devices</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VirtualizedListDemo;