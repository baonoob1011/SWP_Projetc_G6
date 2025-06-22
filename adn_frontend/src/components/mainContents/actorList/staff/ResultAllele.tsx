import {
  MenuItem,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  type SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type Locus = {
  alleleValue: string;
  locusId: string;
  locusName: string;
};

const CreateResultAllele = () => {
  const [allelePosition, setAllelePosition] = useState('');
  const [alleleValue, setAlleleValue] = useState('');
  const [alleleStatus, setAlleleStatus] = useState('ENTERED');
  const [locusList, setLocusList] = useState<Locus[]>([]);
  const [selectedLocus, setSelectedLocus] = useState('');
  const { sampleId } = useParams(); // lấy từ URL

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/locus/get-all-locus', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        toast.error('Không thể lấy danh sách locus');
      } else {
        const data = await res.json();
        setLocusList(data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy locus:', error);
      toast.error('Lỗi khi lấy dữ liệu locus.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLocusChange = (event: SelectChangeEvent<string>) => {
    setSelectedLocus(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setAlleleStatus(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sampleId || !selectedLocus) {
      toast.error('Vui lòng chọn đầy đủ sampleId và locus.');
      return;
    }

    const data = {
      alleleValue,
      allelePosition,
      alleleStatus,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/result-allele/create-result-allele?sampleId=${sampleId}&locusId=${selectedLocus}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success('Tạo kết quả allele thành công!');
        setAlleleValue('');
        setAllelePosition('');
        setAlleleStatus('ENTERED');
        setSelectedLocus('');
      } else {
        const errorData = await response.json();
        toast.error('Lỗi: ' + errorData.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      toast.error('Đã xảy ra lỗi khi gửi dữ liệu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto' }}>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <TextField
          label="Allele (Bệnh nhân)"
          value={allelePosition}
          onChange={(e) => setAllelePosition(e.target.value)}
          required
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <TextField
          label="Giá trị Allele"
          value={alleleValue}
          onChange={(e) => setAlleleValue(e.target.value)}
          required
        />
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="allele-status-label">Trạng thái Allele</InputLabel>
        <Select
          labelId="allele-status-label"
          value={alleleStatus}
          onChange={handleStatusChange}
          input={<OutlinedInput label="Trạng thái Allele" />}
          required
        >
          <MenuItem value="ENTERED">Đã nhập</MenuItem>
          <MenuItem value="NOT_ENTERED">Chưa nhập</MenuItem>
          <MenuItem value="SUSPECT">Nghi ngờ</MenuItem>
          <MenuItem value="VALID">Hợp lệ</MenuItem>
          <MenuItem value="DONE">Hoàn thành</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="locus-select-label">Chọn Locus</InputLabel>
        <Select
          labelId="locus-select-label"
          id="locus-select"
          value={selectedLocus}
          onChange={handleLocusChange}
          input={<OutlinedInput label="Chọn Locus" />}
          required
        >
          <MenuItem value="" disabled>
            -- Chọn locus --
          </MenuItem>
          {locusList.map((locus) => (
            <MenuItem key={locus.locusId} value={locus.locusId}>
              {locus.locusName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!selectedLocus}
        sx={{
          paddingY: 1.5,
          fontWeight: 'bold',
          borderRadius: 2,
        }}
      >
        Gửi kết quả
      </Button>
    </form>
  );
};

export default CreateResultAllele;
