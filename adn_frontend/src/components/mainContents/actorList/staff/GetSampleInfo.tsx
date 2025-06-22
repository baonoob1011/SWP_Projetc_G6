import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowBack } from '@mui/icons-material';

// type Result = {
//   locusName: string;
//   allele1: number;
//   allele2: number;
//   frequency: number;
//   pi: number;
//   locusId: number;
// };
const GetSampleInfo = () => {
  const { appointmentId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [samples, setSamples] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [result, setResult] = useState<Result>({
  //   locusName: '',
  //   allele1: 0,
  //   allele2: 0,
  //   frequency: 0,
  //   pi: 0,
  //   locusId: 0,
  // });
  const [loading, setLoading] = useState(false);
  const handleResult = async () => {
    const sampleId1 = samples[0]?.sampleResponse?.sampleId;
    const sampleId2 = samples[1]?.sampleResponse?.sampleId;
    try {
      const res = await fetch(
        `http://localhost:8080/api/result-locus/create-result-locus?sampleId1=${sampleId1}&sampleId2=${sampleId2}&appointmentId=${appointmentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({}),
        }
      );
      if (!res.ok) {
        toast.error('Không đúng định dạng');
      } else {
        toast.success('thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchSamples = async () => {
      if (!appointmentId) return;

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/sample/get-all-sample?appointmentId=${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (!res.ok) throw new Error('Không thể lấy dữ liệu mẫu');

        const data = await res.json();
        setSamples(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu mẫu');
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, [appointmentId]);

  return (
    <Paper
      style={{ padding: 20, maxWidth: 1000, margin: 'auto', marginTop: 40 }}
    >
      <Button
        component={NavLink}
        to={`/s-page/checkAppointment/${appointmentId}`}
      >
        <ArrowBack />
      </Button>
      <Typography variant="h6" gutterBottom>
        Danh sách mẫu đã thu
      </Typography>

      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : samples.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên bệnh nhân</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Quan hệ</TableCell>
              <TableCell>Loại mẫu</TableCell>
              <TableCell>Mã mẫu</TableCell>
              <TableCell>Ngày thu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {samples.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.patientSampleResponse.fullName}</TableCell>
                <TableCell>{item.patientSampleResponse.gender}</TableCell>
                <TableCell>{item.patientSampleResponse.relationship}</TableCell>
                <TableCell>{item.sampleResponse.sampleType}</TableCell>
                <TableCell>{item.sampleResponse.sampleCode}</TableCell>
                <TableCell>{item.sampleResponse.collectionDate}</TableCell>
                <TableCell>{item.sampleResponse.collectionDate}</TableCell>
                <Button
                  component={NavLink}
                  to={`/s-page/record-result/${item.sampleResponse.sampleId}`}
                >
                  ghi kết quả
                </Button>
              </TableRow>
            ))}
          </TableBody>
          <Button
            type="button"
            onClick={handleResult}
            variant="contained"
            color="primary"
          >
            Gửi kết quả
          </Button>
        </Table>
      ) : (
        <Typography>Không có mẫu nào được thu.</Typography>
      )}
    </Paper>
  );
};

export default GetSampleInfo;
