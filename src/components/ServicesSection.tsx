import React, { useState } from 'react';
import { Truck, MessageCircle, Package, RotateCcw, Clock, X } from 'lucide-react';

export const ServicesSection = () => {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const services = [
    {
      icon: Truck,
      title: "توصيل سريع",
      description: "الطلب يوصل في 7-8 أيام"
    },
    {
      icon: MessageCircle,
      title: "تواصل ممتاز",
      description: "خدمة عملاء ممتازة"
    },
    {
      icon: Package,
      title: "تغليف مميز",
      description: "تغليف وجودة عالية"
    },
    {
      icon: RotateCcw,
      title: "سياسة الإرجاع",
      description: "اضغط لمعرفة المزيد ⇒",
      onClick: () => setShowReturnModal(true)
    },
    {
      icon: Clock,
      title: "خدمة 24 ساعة",
      description: "موجودين عشانك يبنتخالتي"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className={`text-center p-6 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${service.onClick ? 'cursor-pointer' : ''}`}
                onClick={service.onClick}
              >
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-black" strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-red-600 mb-3" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Return Policy Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowReturnModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="pr-8">
              <h3 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
                سياسة الإرجاع والاستبدال
              </h3>
              
              <div className="text-sm text-gray-700 leading-relaxed text-right">
                <p>المعاينة في وجود المندوب<br />
                الاستبدال في حالة وجود ديفوه<br />
                بتصوري الديفو وتبعتيلنا وبنبعتلك قطعة جديدة بنفس الشكل واللون</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
