import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailWhenScheduleSuccess(
    email: string,
    customer_name: string,
    date: string,
    slot: string,
    doctor_name: string,
  ) {
    console.log('object');
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đặt lịch thành công',
        html: `<body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe
                    UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif">
                    <div style="width:50vw; margin: 0 auto">
                        <div style="width: 100%; height: 100px; margin: 0 auto;">
                            <img src="https://live.staticflickr.com/65535/54068155296_11366083ac_t.jpg"
                                style="width: auto;height:100px;object-fit: cover; margin-left: 45%;">
                        </div>
                        <table style="padding:0 40px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation"
                            width="100%">
                            <tbody>
                                <tr>
                                    <td>
                                        <hr
                                            style="width:100%;border:none;border-top:1px solid black;border-color:black;margin:20px 0" />
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;margin-bottom: 25px;">
                                            Kính gửi Quý khách
                                            <a style="font-size:16px;line-height:22px;margin:16px 0;font-weight: bold;">${
                                              customer_name || ''
                                            },</a>
                                        </p>
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                            Trước tiên, chúng tôi xin chân thành cảm ơn Quý khách đã tin tưởng và lựa chọn dịch vụ tư
                                            vấn tâm lý của <a
                                                style="font-weight:bold;text-decoration:none;font-size:14px;line-height:22px">
                                                Hemedy
                                            </a>. Chúng tôi rất hân hạnh được đồng hành cùng Quý khách trong
                                            hành trình chăm sóc sức khỏe tinh thần.
                                        </p>
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                            Chúng tôi xin xác nhận lại lịch hẹn của Quý khách như sau:
                                        </p>

                                        <div style="margin-left: 25px;">
                                            <p style="font-weight:bold;font-size:14px;line-height:22px;margin:10px 0;color:#3c4043">
                                                Ngày hẹn:
                                                <a style="font-weight:400;text-decoration:none;font-size:14px;line-height:22px">
                                                    ${date}
                                                </a>
                                            </p>
                                            <p style="font-weight:bold;font-size:14px;line-height:22px;margin:10px 0;color:#3c4043">
                                                Giờ hẹn:
                                                <a style="font-weight:400;text-decoration:none;font-size:14px;line-height:22px">
                                                    ${slot}
                                                </a>
                                            </p>
                                            <p style="font-weight:bold;font-size:14px;line-height:22px;margin:10px 0;color:#3c4043">
                                                Chuyên gia tư vấn:
                                                <a style="font-weight:400;text-decoration:none;font-size:14px;line-height:22px">
                                                    ${doctor_name}
                                                </a>
                                            </p>
                                        </div>
                                        </p>
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                            Trong trường hợp Quý khách cần thay đổi thời gian hoặc có bất kỳ yêu cầu đặc biệt nào, xin
                                            vui lòng liên hệ với chúng tôi.
                                            Chúng tôi sẽ hỗ trợ Quý khách nhanh chóng và tận tình nhất có thể.
                                        </p>
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043;text-align: justify">
                                            Một lần nữa, xin cảm ơn Quý khách đã tin tưởng lựa chọn <a
                                                style="font-weight:bold;text-decoration:none;font-size:14px;line-height:22px">
                                                Hemedy
                                            </a>. Chúng tôi mong sớm
                                            được gặp Quý khách và hy vọng rằng buổi tư vấn sẽ mang lại những giá trị hữu ích cho Quý
                                            khách.
                                        </p>
                                        <p style="font-size:14px;line-height:22px;margin:16px 0;color:#3c4043">Trân trọng,</p>
                                        <p
                                            style="font-weight:bold;font-size:16px;line-height:22px;margin:16px 0px 0px 0px;color:#3c4043">
                                            Hemedy</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </body>`,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
