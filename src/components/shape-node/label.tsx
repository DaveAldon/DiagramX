import TextareaAutosize from "react-textarea-autosize";

function NodeLabel(props: {
  placeholder: string;
  data: any;
  onContentsChange: (value: string) => void;
}) {
  {
    /* <input type="text" className="node-label" placeholder={props.placeholder} /> */
  }

  return (
    <TextareaAutosize
      className={`node-label resize-none p-2 text-center text-sm  `}
      //placeholder={data.type}
      value={props.data}
      onChange={(e) => props.onContentsChange(e.target.value)}
    />
  );
}

export default NodeLabel;
