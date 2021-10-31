const emailTemplate = (content, delay) => {
	return `
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
    `;
};
