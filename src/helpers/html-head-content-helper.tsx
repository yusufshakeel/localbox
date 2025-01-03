import {WEBSITE_NAME} from '@/constants';

export type HtmlHeadPropsType = {
    title?: string;
};

export default function htmlHeadContentHelper(props: HtmlHeadPropsType = {}) {
  const title = props.title ? props.title + ' | ' + WEBSITE_NAME : WEBSITE_NAME;
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </>
  );
}