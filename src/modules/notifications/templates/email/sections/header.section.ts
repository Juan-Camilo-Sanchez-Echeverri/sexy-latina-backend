import { envs } from '@configs/envs.config';

const headerImage = `${envs.appUrl}/email/header.png`;

export const header = `
<header style="padding:0;text-align:center;">
	<img src="${headerImage}" alt="Piemce" style="width:50%" />
</header>
`;
