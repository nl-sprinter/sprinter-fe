import Layout from '../common/Layout';
import { useState } from 'react';

const ProductBacklogPage = () => {
    const backlogs = [
        { sprint: 'sprint1', title: 'aaaa' },
        { sprint: 'sprint1', title: 'bbbb' },
        { sprint: 'sprint2', title: 'bcbcb' },
    ];

    return (
        <Layout showFunctions showSidebar>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">
                    Product Backlog
                </h1>
                
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="divide-y divide-gray-200">
                        {backlogs.map((backlog, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium">
                                        {backlog.sprint} - {backlog.title}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                                            수정
                                        </button>
                                        <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductBacklogPage;