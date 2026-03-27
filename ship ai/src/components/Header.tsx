import { useState } from 'react';
import { Package, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userProfile?: { name: string; photoUrl: string };
}

export function Header({ isLoggedIn, onLogin, onLogout, userProfile }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 fixed top-0 left-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">ShipAI</span>
      </div>
      
      <nav className="flex items-center gap-6 relative">
        {isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200"
            >
              {userProfile?.photoUrl ? (
                <img src={userProfile.photoUrl} alt="profile" className="w-5 h-5 rounded-full" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{userProfile?.name || '마이페이지'}</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <button 
                  onClick={() => {
                    onLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-indigo-200"
            >
              <User className="w-4 h-4" />
              <span>로그인</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 animate-fade-in-up">
                <div className="text-center mb-3">
                  <h3 className="text-sm font-bold text-gray-800">ShipAI 시작하기</h3>
                  <p className="text-xs text-gray-500 mt-1">로그인하고 모든 검색 기록을 저장하세요.</p>
                </div>
                <button 
                  onClick={() => {
                    onLogin();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  구글 계정으로 로그인
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
