import { envs } from '@configs';

const footerImage = `${envs.appUrl}/email/footer.png`;

export const footer = `
<footer style="padding:0;text-align:center;">
	<img src="${footerImage}" alt="Piemce footer" style="width:50%" />
</footer>
`;
