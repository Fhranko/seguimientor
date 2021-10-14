const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');

const token = 'secret_DOIjs0vl1V02sGCRlNHM7O5Kat6zqMf7FCQQIHKmqHT';
sgMail.setApiKey(
	'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'
);

const sendEmail = (to, text, content) => {
	const msg = {
		to: to, // Change to your recipient
		from: 'f.huanaco@rosuma.com', // Change to your verified sender
		subject: 'Notificación de pendiente',
		text: `TEXTO: ${text}`,
		html: `<strong>${content}</strong>`,
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
			const today = new Date();
			response.data.results.forEach((element) => {
				if (element.properties.Completado.checkbox === false) {
					const _to = element.properties.Correo.rich_text[0].plain_text;
					const _content = element.properties.Pendiente.title[0].plain_text;
					// console.log(element.properties.Pendiente.title[0].plain_text);
					// console.log(element.properties.Correo.rich_text[0].plain_text);
					// console.log(element.properties.Entrega.date.start);

					console.log(
						moment(
							moment(element.properties.Entrega.date.start).format('YYYY MM DD')
						).isSame(moment(today).format('YYYY MM DD'))
					);

					if (
						moment(
							moment(element.properties.Entrega.date.start).format('YYYY MM DD')
						).isSame(moment(today).format('YYYY MM DD'))
					) {
						sendEmail(
							_to,
							'bla bla bla',
							`El siguiente pendiente con fecha de entrega ${moment(
								element.properties.Entrega.date.start
							).format('YYYY MM DD')} finaliza hoy: ${_content}`
						);
					} else if (
						moment(
							moment(element.properties.Entrega.date.start).format('YYYY MM DD')
						).isBefore(moment(today).format('YYYY MM DD'))
					) {
						const delay = moment(element.properties.Entrega.date.start).diff(
							moment(today).format('YYYY MM DD'),
							'days'
						);
						sendEmail(
							_to,
							'bla bla bla',
							`
							El siguiente pendiente con fecha de entrega ${moment(
								element.properties.Entrega.date.start
							).format('YYYY MM DD')} está retrasado: ${_content}
							La siguiente cantidad de días :
							${Math.abs(delay)}
							`
						);
					}
				}
			});

			res.send({ status: 'ok' });
		})
		.catch((err) => {
			res.send(err);
		});
};
