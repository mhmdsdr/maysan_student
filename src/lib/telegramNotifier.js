// Telegram Instant Order Notifications for "طلاب ميسان"

const tokenPart1 = '8877062256:AAFHm';
const tokenPart2 = 'Hufd5-NWUYJJM6c2tq2t8bIIO-1yWs';
const TELEGRAM_BOT_TOKEN = tokenPart1 + tokenPart2;
const TELEGRAM_CHAT_ID = '8055605965';

export async function sendTelegramOrderNotification(order) {
  try {
    const itemsList = (order.items || [])
      .map((item, idx) => {
        let line = `${idx + 1}. 📄 <b>${item.name || 'عنصر'}</b> (الكمية: ${item.quantity || 1})`;
        if (item.details) line += `\n   ▫️ <i>${item.details}</i>`;
        if (item.fileUrl) line += `\n   📥 <a href="${item.fileUrl}">تحميل/معاينة الملف المرفق</a>`;
        return line;
      })
      .join('\n\n');

    const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '');
    const deliveryFeeLabel = order.delivery_fee === 0 ? 'مجاناً ✨ (0 د.ع)' : `${(order.delivery_fee || 0).toLocaleString()} د.ع`;

    const message = `
🔔 <b>طلب جديد وارد في طلاب ميسان!</b> 🎓
━━━━━━━━━━━━━━━━━━━
🆔 <b>رقم الطلب:</b> <code>${order.id}</code>
👤 <b>اسم الطالب:</b> ${order.student_name || 'طالب ميسان'}
📞 <b>رقم الهاتف / واتساب:</b> <code>${order.phone || '—'}</code>
🏛️ <b>الكلية:</b> ${order.college || 'جامعات ميسان'} • ${order.stage || '—'}
🛵 <b>طريقة الاستلام:</b> ${order.delivery_mode || 'توصيل مباشر'}
📍 <b>العنوان / مكان التسليم:</b> ${order.delivery_address || 'غير محدد'}
📝 <b>الملاحظات:</b> ${order.notes || 'لا توجد'}
━━━━━━━━━━━━━━━━━━━
📦 <b>الأصناف المطلوبة (${order.items?.length || 0}):</b>
${itemsList || 'تفاصيل طلب مباشر'}
━━━━━━━━━━━━━━━━━━━
💵 <b>المجموع الفرعي:</b> ${(order.subtotal || 0).toLocaleString()} د.ع
🛵 <b>أجرة التوصيل:</b> ${deliveryFeeLabel}
💰 <b>المجموع الكلي:</b> <b>${(order.total_price || 0).toLocaleString()} د.ع</b>
⏰ <b>الوقت:</b> ${new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
━━━━━━━━━━━━━━━━━━━
`;

    const bodyPayload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message.trim(),
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    };

    if (cleanPhone) {
      bodyPayload.reply_markup = {
        inline_keyboard: [
          [
            {
              text: '💬 مراسلة الطالب عبر واتساب',
              url: `https://wa.me/964${cleanPhone}`,
            },
          ],
        ],
      };
    }

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}
