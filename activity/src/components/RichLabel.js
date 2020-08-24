import React from "react";
import ReactDOMServer from "react-dom/server";
import ReactMarkdown from 'react-markdown';
import { makeStyles, withStyles } from "@material-ui/core";


const CustomCss = withStyles({
  '@global': {
    'p': {
      marginTop: 0,
      marginBottom: 0,
    },
    'img': {
      maxWidth: '50%',
    },
  },
})(() => null);

export function RichLabel(props) {
  return (
    <>
      <CustomCss />
      <label
        className={props.className}
        htmlFor={props.htmlFor}
        // dangerouslySetInnerHTML={{
        //   __html: md.render(props.children),
        // }}
      >
        <ReactMarkdown
          source={props.children}
          renderers={{link: props => <a href={props.href} target="_blank">{props.children}</a>}}
        />
      </label>
    </>
  );
}