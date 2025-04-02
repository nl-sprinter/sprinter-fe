import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFreeSpeechList, addFreeSpeech, deleteFreeSpeech } from '../../api/projectApi';
import { FiX, FiSend } from 'react-icons/fi';

const FreeSpeechContainer = () => {
    const { projectId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    // 글 목록 가져오기
    const fetchPosts = async () => {
        try {
            const data = await getFreeSpeechList(projectId);
            console.log(`data=${data}`);
            setPosts(data || []);
        } catch (error) {
            console.error('자유발언 목록 조회 실패:', error);
            setPosts([]);
        }
    };

    // 초기 로딩
    useEffect(() => {
        fetchPosts();
    }, [projectId]);

    // 글 등록
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            await addFreeSpeech(projectId, { content: newPost });
            setNewPost('');
            fetchPosts(); // 목록 새로고침
        } catch (error) {
            console.error('자유발언 등록 실패:', error);
        }
    };

    // 글 삭제
    const handleDelete = async (id) => {
        try {
            await deleteFreeSpeech(projectId, id);
            fetchPosts(); // 목록 새로고침
        } catch (error) {
            console.error('자유발언 삭제 실패:', error);
        }
    };

    return (
        <div className="h-full flex flex-col gap-2">
            {/* 글 작성 카드 */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-2 flex gap-2">
                <input
                    type="text"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="자유롭게 의견을 남겨보세요"
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                />
                <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                        newPost.trim()
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <FiSend size={16} />
                </button>
            </form>

            {/* 글 목록 */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                {Array.isArray(posts) && posts.map(p => (
                    <div 
                        key={p.id}
                        className="bg-white rounded-lg p-2 flex justify-between items-start group"
                    >
                        <p className="text-sm text-gray-600 whitespace-pre-wrap break-words flex-1 px-1">
                            {p.content}
                        </p>
                        <button
                            onClick={() => handleDelete(p.id)}
                            className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreeSpeechContainer;
