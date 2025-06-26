import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CreateDiscount = () => {
  const [discount, setDiscount] = useState({
    discountName: '',
    discountValue: '',
    startDate: '',
    endDate: '',
  });
  const { serviceId } = useParams<string>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/discount/create-discount-service?serviceId=${serviceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // nếu có auth
          },
          body: JSON.stringify({
            ...discount,
            discountValue: parseFloat(discount.discountValue), // đảm bảo là kiểu double
          }),
        }
      );

      if (!response.ok) throw new Error('Tạo giảm giá thất bại');

      toast.success('Tạo giảm giá thành công!');
      setDiscount({
        discountName: '',
        discountValue: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.log(error);
      toast.error('Đã xảy ra lỗi khi tạo giảm giá');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
      <Typography variant="h5" gutterBottom>
        Tạo chương trình giảm giá
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        mt={2}
      >
        <TextField
          label="Tên chương trình"
          name="discountName"
          value={discount.discountName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Giá trị giảm (%)"
          name="discountValue"
          type="number"
          inputProps={{ min: 0, max: 100, step: 0.1 }}
          value={discount.discountValue}
          onChange={handleChange}
          required
        />
        <TextField
          label="Ngày bắt đầu"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={discount.startDate}
          onChange={handleChange}
          required
        />
        <TextField
          label="Ngày kết thúc"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={discount.endDate}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Tạo giảm giá
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateDiscount;
