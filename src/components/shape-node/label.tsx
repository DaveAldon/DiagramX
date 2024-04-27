function NodeLabel(props: { placeholder: string }) {
  return (
    <input type='text' className='node-label' placeholder={props.placeholder} />
  );
}

export default NodeLabel;
