import logoHospital from '@/assets/img/logoHospital.png';
import { type ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={logoHospital}
            alt={props.alt ?? 'Logo hospital'} // usa alt por defecto si no se pasa
            {...props} // permite className, width, height, style, etc.
            className=""
        />
    );
}

