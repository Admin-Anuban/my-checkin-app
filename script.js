// ######################################################################
// ##  สำคัญ! นำ URL ของ Web App ที่คัดลอกมาจากขั้นตอนที่ 3 มาวางที่นี่  ##
// ######################################################################
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIvkUvFyBH7IlckWoJbHnp3RIvNGMbA4TMW2NR5b4m22XafHsdnpciJUtjiElcuMs/exec'; 

// ดึง element ต่างๆ จากหน้า HTML
const form = document.getElementById('checkin-form');
const statusMessage = document.getElementById('status-message');
const buttons = form.querySelectorAll('button[type="submit"]');

// เมื่อฟอร์มถูกส่ง (คือการกดปุ่ม Check-in หรือ Check-out)
form.addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บโหลดใหม่

    // ดึงข้อมูลจากฟอร์มและปุ่มที่ถูกกด
    const formData = new FormData(form);
    const action = document.activeElement.value; // ค่าของปุ่มที่กด (Check-in/Check-out)
    formData.append('Status', action);

    // เปลี่ยนข้อความเป็น "กำลังบันทึก..." และปิดการใช้งานปุ่มชั่วคราว
    statusMessage.textContent = 'กำลังบันทึกข้อมูล...';
    statusMessage.style.color = '#3498db';
    buttons.forEach(button => button.disabled = true);

    // สร้าง Object จากข้อมูลในฟอร์ม
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // ส่งข้อมูลไปที่ Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // สำคัญมากสำหรับ Apps Script
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        redirect: 'follow'
    })
    .then(response => {
         // ไม่สามารถอ่าน response ได้โดยตรงในโหมด no-cors แต่การส่งสำเร็จก็ถือว่าโอเค
         statusMessage.textContent = 'บันทึกข้อมูลสำเร็จ!';
         statusMessage.style.color = '#27ae60';
         form.reset(); // ล้างค่าในฟอร์ม
    })
    .catch(error => {
        statusMessage.textContent = 'เกิดข้อผิดพลาด: ' + error.message;
        statusMessage.style.color = '#e74c3c';
    })
    .finally(() => {
        // เปิดการใช้งานปุ่มอีกครั้ง
        buttons.forEach(button => button.disabled = false);
        // ทำให้ข้อความสถานะหายไปหลังจาก 3 วินาที
        setTimeout(() => {
            statusMessage.textContent = '';
        }, 3000);
    });
});
