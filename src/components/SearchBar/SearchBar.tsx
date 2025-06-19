import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export default function SearchBar() {
  return (
    <div     className='w-100' style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <InputGroup>
        <Form.Control
    
          type="text"
          placeholder="Search product by name"
          style={{
            borderRadius: '0.5rem',
            paddingRight: '2.5rem',
            color: '#333',
            fontSize: '0.9rem'
          }}
        />
        <InputGroup.Text
        className='border-0'
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            color: '#999',
          }}
        >
          <Search />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
}
