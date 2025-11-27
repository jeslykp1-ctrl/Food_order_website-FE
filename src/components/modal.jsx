import { Dialog, DialogContent, Button, Box, Typography } from "@mui/material";

export default function FullScreenPopup({ open, onClose, message, onAction }) {
  return (
    <Dialog
      open={open}
      fullScreen
      onClose={onClose}
      PaperProps={{ sx: { backgroundColor: "rgba(0,0,0,0.7)" } }}
    >
      <DialogContent className="flex flex-col items-center justify-center h-full text-center text-white">
        <Typography variant="h4" gutterBottom>
          {message}
        </Typography>
        {onAction && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAction}
            sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px" }}
          >
           OK
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
