import logo from './logo.svg';
import './App.css';
import CardGrid from './Component/CardGrid';
import Expandedcard from './ExpapndedCard/Expandedcard.js';
import TextEditor from './Component/TextEditor.js';
import NameDropdown from './Component/NameDropdown.js';
import Quill from 'quill';
import SimpleEditor from './Component/SimpleEditor.js';
import EditorWithExcelUpload from './Component/EditorWithExcelUpload.js';
import HtmlEditorsDemo from './Component/HtmlEditorsDemo.js';

function App() {
  return (
<>
{/* <CardGrid/> */}
{/* <Expandedcard/> */}
{/* <TextEditor/> */}
{/* <NameDropdown/> */}
<SimpleEditor/>
<h1> Second </h1>
<EditorWithExcelUpload/>
<h1>Demo</h1>
<HtmlEditorsDemo/>

</>
  );
}

export default App;
