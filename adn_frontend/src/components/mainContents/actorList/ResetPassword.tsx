import { Button, Paper, TextField, Box } from "@mui/material";
import { useState } from "react";

// type ChangPass ={
//     oldPassword: string;
//     password: string;
//     confirm
// }

const NewPassWord = () => {
    const [oldPassword, setOldPassWord] = useState("");

    const handleChangPass = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/api/user/update-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword}),
            });

            if (!res.ok) {
                alert("Mật khẩu cũ không đúng");
            } else {
                alert("Xác thực thành công");
                // Điều hướng nếu cần
                // navigate("/chang-pass");
            }
        } catch (error) {
            console.log(error);
            alert("Lỗi hệ thống");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleChangPass}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
                <TextField
                    label="Nhập mật khẩu mới"
                    fullWidth
                    value={oldPassword}
                    type="password"
                    onChange={(e) => setOldPassWord(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Xác nhận
                </Button>
            </Paper>
        </Box>
    );
};

export default NewPassWord;
