import {WEBSITE_NAME} from '@/constants';

export type HtmlHeadPropsType = {
    title?: string;
};

export default function htmlHeadContentHelper(props: HtmlHeadPropsType) {
  return (
    <>
      <title>{props.title || WEBSITE_NAME}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </>
  );
}