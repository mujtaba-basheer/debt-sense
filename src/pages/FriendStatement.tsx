import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function FriendStatement() {
  const { friendId } = useParams<{ friendId: string }>()

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Friend Statement</Typography>
      <Typography variant="body1" color="text.secondary">
        Friend ID: {friendId}
      </Typography>
    </Box>
  )
}
