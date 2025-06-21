import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const GetSampleInfo = () => {
  const { appointmentId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        if (!res.ok) throw new Error('Không thể fetch dữ liệu mẫu');

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>Không có mẫu nào được thu.</Typography>
      )}
    </Paper>
  );
};

export default GetSampleInfo;
