import React from 'react';
import NavbarComponent from '@/components/NavbarComponent';
import FooterComponent from '@/components/FooterComponent';

type PropsType = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    children: any
}

export default function BaseLayout(props: PropsType) {
  return (
    <React.Fragment>
      <NavbarComponent/>
      {props.children}
      <FooterComponent/>
    </React.Fragment>
  );
}