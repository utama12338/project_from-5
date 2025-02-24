'use client'
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material'
import { PermissionGuard } from '../../components/PermissionGuard'
import React from 'react'

const TestPage = () => {
  const boxes = [
    { id: 1, title: 'เฉพาะ user', description: 'Description for Box 1' },
    { id: 2, title: 'ADMIN', description: 'Description for Box 2' },
    { id: 3, title: 'SUPERUSER', description: 'Description for Box 3' },
  ]

  const handleView = (id: number) => {
    console.log(`Viewing box ${id}`)
  }

  const handleEdit = (id: number) => {
    console.log(`Editing box ${id}`)
  }

  return (
    <Container>
      <Stack spacing={3} py={4}>
        {boxes.map((box) => (
          <Card key={box.id} sx={{ p: 3 }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                {box.title}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {box.description}
              </Typography>
              <Stack direction="row" spacing={2}>
              <PermissionGuard requiredPermissions={{ canCreateuser: true }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleView(box.id)}
                >
                  View Details
                </Button>
                </PermissionGuard>
                <PermissionGuard requiredPermissions={{ canEdit: true }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(box.id)}
                  >
                    Edit
                  </Button>
                </PermissionGuard>
              </Stack>
            </Box>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}

export default TestPage
