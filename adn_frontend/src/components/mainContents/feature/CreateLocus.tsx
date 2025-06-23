import { useState } from 'react';
import { toast } from 'react-toastify';

type Locus = {
  locusName: string;
  description: string;
};

const CreateLocus = () => {
  const [locus, setLocus] = useState<Locus>({
    locusName: '',
    description: '',
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocus((locus) => ({
      ...locus,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/locus/create-locus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(locus),
      });
      if (!res.ok) {
        let errorMessage = 'Không thể đăng ký'; // mặc định

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          errorMessage = await res.text();
        }

        toast.error(errorMessage);
      } else {
        toast.success('Tạo locus thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded bg-light shadow-sm w-100"
      style={{ maxWidth: '500px', margin: 'auto' }}
    >
      <div className="mb-3">
        <label htmlFor="locusName" className="form-label">
          Locus Name
        </label>
        <input
          type="text"
          className="form-control"
          id="locusName"
          name="locusName"
          onChange={handleInput}
          value={locus.locusName}
          placeholder="Nhập tên locus"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Mô tả
        </label>
        <input
          type="text"
          className="form-control"
          id="description"
          name="description"
          onChange={handleInput}
          value={locus.description}
          placeholder="Nhập mô tả locus"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Tạo Locus
      </button>
    </form>
  );
};

export default CreateLocus;
