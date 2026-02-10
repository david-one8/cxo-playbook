'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useMasterStore } from '@/lib/stores/masterStore';
import { ProductForm } from '@/components/features/masters/product-form';
import { ShiftForm } from '@/components/features/masters/shift-form';
import { DowntimeCodeForm } from '@/components/features/masters/downtime-code-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function MastersPage() {
  const [open, setOpen] = useState(false);
  const { products, shifts, downtimeCodes, deleteProduct, deleteShift, deleteDowntimeCode } =
    useMasterStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Master Data Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage products, shifts, and downtime codes
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="downtime">Downtime Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Steel Products</CardTitle>
                  <CardDescription>Manage steel grades and dimensions</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Enter the steel grade and dimension details
                      </DialogDescription>
                    </DialogHeader>
                    <ProductForm onSuccess={() => setOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Dimension</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No products added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.grade}</TableCell>
                        <TableCell>{product.dimension}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shift Timings</CardTitle>
                  <CardDescription>Define operational shifts</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shift
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Shift</DialogTitle>
                      <DialogDescription>Define shift name and timings</DialogDescription>
                    </DialogHeader>
                    <ShiftForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shift Name</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No shifts defined yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    shifts.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">{shift.name}</TableCell>
                        <TableCell>{shift.startTime}</TableCell>
                        <TableCell>{shift.endTime}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteShift(shift.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Downtime Codes</CardTitle>
                  <CardDescription>Standardized stoppage reasons</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Downtime Code</DialogTitle>
                      <DialogDescription>Create a new downtime reason code</DialogDescription>
                    </DialogHeader>
                    <DowntimeCodeForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downtimeCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No downtime codes defined yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    downtimeCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono font-medium">{code.code}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              code.category === 'MECHANICAL'
                                ? 'default'
                                : code.category === 'ELECTRICAL'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {code.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{code.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDowntimeCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
