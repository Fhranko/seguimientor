require('dotenv').config();

const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');

const token = 'token here'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, content, delay) => {
	const msg = {
		to: to, // Change to your recipient
		from: 'f.huanaco@rosuma.com', // Change to your verified sender
		subject: 'Notificación de pendiente',
		text: `TEXTOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`,
		html: `
		<center style="width: 100%; background: rgb(255, 255, 255)">			
			<!-- Email Body : BEGIN -->
			<table
				cellspacing="0"
				cellpadding="0"
				border="0"
				align="center"
				bgcolor="#ffffff"
				width="700"	
			>
				<!-- Hero Image, Flush : BEGIN -->
				<tr>
					<td>
						<img
							src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-01.jpg"
							width="700"
							alt="alt_text"
						/>
					</td>
				</tr>
				<tr>
					<td>
						<img
							src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-02.jpg"
							width="700"
							alt="alt_text"
						/>
					</td>
				</tr>
				<tr>
					<td>
						<img
							src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-Footer-03.jpg"
							width="700"
							alt="alt_text"
						/>
					</td>
				</tr>
				<!-- Hero Image, Flush : END -->

				<!-- 1 Column Text : BEGIN -->
				<tr>
					<td
						style="
							padding: 20px;
							text-align: center;
							font-family: sans-serif;
							font-size: 15px;
							mso-height-rule: exactly;
							line-height: 20px;
							color: #555555;
						"
					>
          Este es un recordatorio automático
					</td>          
				</tr>
        <tr>
					<td
						style="							
							padding: 20px;
							text-align: center;
							font-family: sans-serif;
							font-size: 20px;													
							color: #555555;
						"
					>
						${content}    
            ---------------------
						Retrasado la siguiente cantidad de días: ${delay}    
					</td>      
				</tr>
			</table>

				
			<!-- Email Body : END -->

			<!-- Email Footer : BEGIN -->
			<table
				cellspacing="0"
				cellpadding="0"
				border="0"
				align="center"
				width="700"
			>
      <tr>
        <td>
          <a href="https://www.facebook.com/totto.bolivia/"target="_blank">
            <img
              src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-Footer-05.jpg"
              width="160"
              alt="alt_text"
            />
          </a>
        </td>
        <td>
          <a href="https://www.instagram.com/totto.bo"target="_blank">
            <img
              src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-Footer-06.jpg"
              width="160"
              alt="alt_text"
            />
          </a>
        </td>
        <td>
          <a href="https://api.whatsapp.com/send?phone=59178983491"target="_blank">
            <img
              src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-Footer-07.jpg"
              width="160"
              alt="alt_text"
            />
          </a>
        </td>
        <td>
          <a href="https://bo.totto.com/"target="_blank">
            <img
              src="https://calidad.gruposfr.com/images/Mailing-Calidad-Totto-Footer-08.jpg"
              width="220"
              alt="alt_text"
            />
          </a>
        </td>
      </tr>
			</table>
			<!-- Email Footer : END -->
		</center>
    `,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent');
		})
		.catch((error) => {
			console.error(error);
		});
};

exports.getDatabase = (req, res) => {
	return axios
		.post(
			'https://api.notion.com/v1/databases/bf68272ea5c448a5b8ffff52905deb1c/query',
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`, //the token is a variable which holds the token
					'Notion-Version': '2021-08-16',
				},
			}
		)
		.then((response) => {
			const today = moment().format('l');
			const data = response.data.results;
			const returnData = [];

			data.forEach((element, i) => {
				const startDate = moment(element.properties.Entrega.date.start);
				const responsables = element.properties.Correo.multi_select;

				if (element.properties.Completado.checkbox === false) {
					if (startDate.isSame(today)) {
						console.log('La tarea vencerá hoy');
						responsables.forEach((responsable) => {
							sendEmail(
								responsable.name,
								element.properties.Pendiente.title[0].text.content
							);
						});

						returnData.push({
							tarea: element.properties.Pendiente.title[0].text.content,
							fechaVencimiento: startDate,
							mensaje: 'La tarea vencerá hoy',
							today,
						});
					} else if (startDate.isBefore(today)) {
						console.log('La tarea venció');
						const delay = startDate.diff(today, 'days');
						responsables.forEach((responsable) => {
							sendEmail(
								responsable.name,
								element.properties.Pendiente.title[0].text.content,
								delay
							);
						});

						returnData.push({
							tarea: element.properties.Pendiente.title[0].text.content,
							fechaVencimiento: startDate,
							mensaje: 'La tarea venció',
							today,
						});
					}
				}
			});

			// response.data.results.forEach((element) => {
			// 	if (element.properties.Completado.checkbox === false) {
			// 		if (
			// 			moment(
			// 				moment(element.properties.Entrega.date.start).format('YYYY MM DD')
			// 			).isSame(moment(today).format('YYYY MM DD'))
			// 		) {
			// 			element.properties.Correo.multi_select.forEach((element) => {
			// 				const _to = element.name;
			// 				sendEmail(
			// 					_to,
			// 					'bla bla bla',
			// 					`El siguiente pendiente con fecha de entrega ${moment(
			// 						element.properties.Entrega.date.start
			// 					).format('YYYY MM DD')} finaliza hoy: ${_content}`
			// 				);
			// 			});
			// 		} else if (
			// 			moment(
			// 				moment(element.properties.Entrega.date.start).format('YYYY MM DD')
			// 			).isBefore(moment(today).format('YYYY MM DD'))
			// 		) {
			// 			const delay = moment(element.properties.Entrega.date.start).diff(
			// 				moment(today).format('YYYY MM DD'),
			// 				'days'
			// 			);

			// 			element.properties.Correo.multi_select.forEach((element) => {
			// 				const _to = element.name;

			// 				sendEmail(
			// 					_to,
			// 					'bla bla bla',
			// 					`
			//               El siguiente pendiente con fecha de entrega ${moment(
			// 								element.properties.Entrega.date.start
			// 							).format('YYYY MM DD')} está retrasado: ${_content}
			//               La siguiente cantidad de días :
			//               ${Math.abs(delay)}
			//               `
			// 				);
			// 			});
			// 		}
			// 	}
			// });
			res.send(returnData);
			// res.send(_to);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			});
		});
};
