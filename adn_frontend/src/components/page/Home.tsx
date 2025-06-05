import "./Home.module.css"

export default function Home() {
  const services = [
    {
      title: "Xét nghiệm huyết thống",
      desc: "Xác định cha - con, mẹ - con,... độ chính xác cao.",
      icon: "🧬",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Xét nghiệm hành chính",
      desc: "Dùng cho mục đích pháp lý, thủ tục hành chính.",
      icon: "📋",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Xét nghiệm dân sự",
      desc: "Giải thích kết quả và tư vấn hướng xử lý.",
      icon: "💡",
      gradient: "from-orange-500 to-red-600"
    },
  ];

  const reasons = [
    {
      icon: "👨‍⚕️",
      text: "Đội ngũ chuyên gia giàu kinh nghiệm",
      desc: "Bác sĩ và kỹ thuật viên được đào tạo chuyên sâu"
    },
    {
      icon: "🔬",
      text: "Trang thiết bị hiện đại, chính xác",
      desc: "Máy móc công nghệ tiên tiến từ châu Âu"
    },
    {
      icon: "🛡️",
      text: "Tư vấn tận tình, bảo mật thông tin",
      desc: "Cam kết bảo mật tuyệt đối thông tin khách hàng"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Trung tâm xét nghiệm
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ADN uy tín
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Nơi bạn có thể tin tưởng để tìm hiểu về nguồn gốc và mối quan hệ huyết thống với công nghệ tiên tiến nhất.
          </p>
          
          {/* CTA Button */}
          <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
            <span className="relative z-10">Đặt lịch xét nghiệm ngay</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {/* Floating DNA Icons */}
          <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{animationDelay: '1s'}}>🧬</div>
          <div className="absolute top-40 right-20 text-3xl animate-bounce" style={{animationDelay: '3s'}}>🔬</div>
          <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{animationDelay: '2s'}}>⚗️</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Dịch vụ nổi bật
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-white/50"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Vì sao chọn chúng tôi?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="text-center group"
              >
                {/* Icon Container */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    {reason.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                  {reason.text}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "99.9%", label: "Độ chính xác" },
              { number: "10,000+", label: "Khách hàng" },
              { number: "5", label: "Năm kinh nghiệm" },
              { number: "24/7", label: "Hỗ trợ" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Trung tâm xét nghiệm ADN
            </h3>
            <p className="text-gray-400 mb-6">
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM<br />
              Điện thoại: (028) 1234 5678 | Email: info@dnatest.vn
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">
              © 2025 Trung tâm xét nghiệm ADN. Bản quyền thuộc về công ty chúng tôi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}