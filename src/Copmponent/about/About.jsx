import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-section about-head">
        <div className="text-center">
          <div className='text-aboutus'>
            <h2 className="text-center text-white">من نحن</h2>
            <p className='text-white m-auto mb-5' >
              مرحبًا بك في "البصمة المعيرة"، حيث نسعى لأن نكون الوسيلة الموثوقة التي تلبي احتياجاتك في العثور على الأشياء المفقودة أو الإعلان عن الممتلكات التي تم العثور عليها.
            </p>
          </div>
        </div>
      </div>

      <div className="about-us-section bg-light"> 
        <div className="justify-content-center">
          <div>
            <h3 style={{ color: "#0000ffff" }}>نبذة عن تعميم</h3>
            <p>
              تأسست منصة "تعميم" في عام 2024 استجابة للحاجة الملحة لإنشاء مكان يجمع الأشخاص الذين يبحثون عن أشياء أو أشخاص مفقودين، والأشخاص الذين يرغبون في المساعدة بالإعلان عما وجدوه.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
