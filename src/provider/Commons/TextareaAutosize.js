import React from 'react';

class TextareaAutosize extends React.PureComponent {
  componentDidMount() {
    const { value, defaultValue } = this.props;
    if (value || defaultValue) {
      this.onInput();
    }
  }

  onInput = () => {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    this.textarea.scrollTop = this.textarea.scrollHeight;
    window.scrollTo(window.scrollLeft, this.scrollTop + this.scrollHeight);
  };

  render() {
    const { onTextChange, inputClassName, ...restProps } = this.props;
    const inputClass = inputClassName ? `autosize ${inputClassName}` : 'autosize';

    return (
      <textarea
        ref={input => {
          this.textarea = input;
        }}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        {...restProps}
        rows={1}
        onChange={onTextChange}
        onInput={this.onInput}
        className={inputClass}
      />
    );
  }
}

export default TextareaAutosize;
