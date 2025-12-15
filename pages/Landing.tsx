import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ShieldCheck, Utensils, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Landing: React.FC = () => {
    const { tables } = useAppContext();

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-900">
            {/* Hero Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop"
                    alt="Restaurant Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">

                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6 font-bold text-sm uppercase tracking-wider">
                            <Utensils size={16} />
                            <span>Smart Restaurant System</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                            Gọi món <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Bằng 1 Chạm</span>
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed mt-4 max-w-lg">
                            Hệ thống gọi món QR Code thông minh. Tối ưu quy trình vận hành, nâng cao trải nghiệm thực khách và tăng doanh thu nhà hàng.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-4">
                        <Link to="/admin" className="inline-flex justify-center items-center bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all hover:shadow-lg hover:-translate-y-1 group">
                            <ShieldCheck className="mr-3" />
                            Quản trị viên
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50/80 rounded-3xl p-8 border border-gray-200 shadow-inner">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <QrCode className="mr-3 text-orange-600" />
                            Demo Khách Hàng
                        </h2>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">Simulator</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {tables.map(t => (
                            <Link
                                key={t}
                                to={`/table/${t}`}
                                className="group relative bg-white border-2 border-gray-100 hover:border-orange-500 p-4 rounded-2xl text-center transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col items-center justify-center h-32"
                            >
                                <div className="bg-gray-100 p-2 rounded-lg mb-2 group-hover:bg-orange-50 transition-colors">
                                    <QrCode size={24} className="text-gray-400 group-hover:text-orange-500" />
                                </div>
                                <div className="text-lg font-bold text-gray-800 group-hover:text-orange-600">Bàn {t}</div>
                                <div className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-wide">Quét mã</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 text-white/30 text-xs font-medium">
                © 2025 QR Food Order Pro. Designer for <a href="http://kiencode.io.vn/" target="_blank">kienit</a>.
            </div>
        </div>
    );
};

export default Landing;