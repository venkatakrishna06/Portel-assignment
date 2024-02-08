import './App.css';
import { Editor, EditorState, convertToRaw, convertFromRaw, Modifier, RichUtils } from 'draft-js';
import { useState, useEffect } from 'react';


function App() {
  const [editorState, setEditorState] = useState(() => {

    // for saving text in the editor into localstorage
    const savedData = localStorage.getItem("draftEditorContent");
    if (savedData) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(savedData)));
    }
    return EditorState.createEmpty();
  });

  // custom styles 
  const customStyleMap = {
    BOLD: { fontWeight: 'bold' },
    UNDERLINE: { textDecoration: 'underline' },
    COLOR_RED: { color: 'red' },
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const block = contentState.getBlockForKey(startKey);
    const blockText = block.getText();
    const textBeforeCursor = blockText.slice(0, startOffset);
    const textBeforeCursortwochar = blockText.slice(Math.max(0, startOffset - 2), startOffset);
    let newEditorState = editorState;

    // Check if user typed '#' followed by space and apply header style 
    if (textBeforeCursor.endsWith("#") && chars === " ") {


      const headerSelection = selectionState.merge({
        anchorOffset: startOffset - 1,
        focusOffset: startOffset,
      });
  
      const contentStateWithoutHash = Modifier.replaceText(
        contentState,
        headerSelection,
        '',
      );
      const contentStateWithHeader = Modifier.setBlockType(
        contentStateWithoutHash,
        headerSelection,
        "header-one"
      );
  
      newEditorState = EditorState.push(
        editorState,
        contentStateWithHeader,
        "change-block-type"
      );
    }
  
    // Check if user typed '*' followed by space to apply BOLD style
    else if (textBeforeCursor.endsWith("*") && chars === " ") {
      const boldSelection = selectionState.merge({
        anchorOffset: startOffset - 1,
        focusOffset: startOffset,
      });

      const contentStateWithBold = Modifier.applyInlineStyle(
        contentState,
        boldSelection,
        "BOLD"
      );
  
      newEditorState = EditorState.push(
        editorState,
        contentStateWithBold,
        "apply-inline-style"
      );
    }

    // Check if user typed '**' followed by space to apply font color RED
    if (textBeforeCursor.endsWith("**") && chars === " ") {
      const redLineSelection = selectionState.merge({
        anchorOffset: startOffset - 2,
        focusOffset: startOffset,
      });
  
      const contentStateWithRedLine = Modifier.applyInlineStyle(
        contentState,
        redLineSelection,
        "COLOR_RED"
      );
  
      newEditorState = EditorState.push(
        editorState,
        contentStateWithRedLine,
        "apply-inline-style"
      );
    }  

    // Check if user typed '***' followed by space to apply underline

    if (textBeforeCursor.endsWith("***") && chars === " ") {
      const underlineSelection = selectionState.merge({
        anchorOffset: startOffset - 3,
        focusOffset: startOffset,
      });
  
      const contentStateWithUnderline = Modifier.applyInlineStyle(
        contentState,
        underlineSelection,
        "UNDERLINE"
      );
  
      newEditorState = EditorState.push(
        editorState,
        contentStateWithUnderline,
        "apply-inline-style"
      );
    }
  
    
    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return "handled";
    }
  
    return "not-handled";
  };
  

  function handleKeyCommand(command, editorState){
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };


   // function to save content to local storage.
  const handleSave = () => {
    localStorage.setItem(
      "draftEditorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
    alert("Content saved to local storage!");
  };


  return (
    <div className="App">
      <span className='page-title'>Demo editor by Venkata Krishna Reddy</span>
      <button className='save-btn' onClick={handleSave} >Save</button>
      <div className='editor-class'>
      <Editor
  editorState={editorState}
  handleBeforeInput={handleBeforeInput}
  handleKeyCommand={handleKeyCommand} 
  onChange={onEditorStateChange} 
  customStyleMap={customStyleMap}
  
/>
      </div>
    </div>
  );
}
export default App;
