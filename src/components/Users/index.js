import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// material-ui
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, Tooltip, Button, Checkbox, IconButton, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, TextField, Container,Backdrop,CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

// project imports
import MainCard from '../../customs/MainCard';
import AddUser from './AddUser';
import DeleteUser from './DeleteUser';
import Navbar from '../Nav';
import { useApi } from './ApiContext';

// Sorting functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (array) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  return;
}

// Table header cells
const headCells = [
  { id: 'id', numeric: true, disablePadding: true, label: '#' },
  { id: 'fname', numeric: true, disablePadding: false, label: 'Name' },
  { id: 'dob', numeric: true, disablePadding: false, label: 'DOB' },
  { id: 'gender', numeric: true, disablePadding: false, label: 'Gender' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Address' },
  { id: 'mobile', numeric: true, disablePadding: false, label: 'Mobile' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
];

// Table header component for sorting
function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align={'right'}>Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// Toolbar styles
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

// toolbar when we select specific user this function calls or else show search bar
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, autocomplete, handleChangeData, handleDeleteAll } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography />
      )}

      {numSelected > 0 ? (
        <Tooltip title={numSelected === 1 ? "Delete" : "Delete Multi"}>
          <IconButton aria-label="delete" onClick={handleDeleteAll}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Autocomplete
          id="combo-box-demo"
          options={autocomplete}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          onChange={(e, value) => handleChangeData(value)}
          renderInput={(params) => <TextField {...params} label="Search Users" variant="outlined" />}
        />
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

// Styles using Material-UI makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  table: {
    minWidth: 1300,
  },
  disabledRow: {
    backgroundColor: theme.palette.action.disabledBackground,
    pointerEvents: 'none',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
},
}));


// Render the component with Material-UI components
const Users = () => {

  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('fname');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [userDetails, setUserDetails] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  // const [jobids, setJobids] = React.useState('');

  // imported hook with contextApi
  const { rows, fetchData, autocomplete, fetchSingleData, selected, setSelected, deleteAllUsers, formateDate, loading, error } = useApi();

  useEffect(() => {
    fetchData();
  }, []);

  // for sorting purpose
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle selecting all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.filter(item => item.delete === false).map(item => item._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Handle clicking on a row checkbox
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  // Handle changing the page for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle changing the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // Check if a row is selected based on its name
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Calculate the number of empty rows to fill the page
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


  // Handle changing the data when searching or selecting a user
  const handleChangeData = (value) => {
    if (value === null) {
      fetchData();
    } else {
      fetchSingleData(value._id);
    }
  }

  // handle for open dialog and create and editing user form
  const handleCreate = (value, type) => {
    setOpen(true);
    if (type == "edit") {
      setOpen(true);
      setIsEditMode(true);
      setUserDetails(value);
    } else {
      setIsEditMode(false);
      setUserDetails(null);
      setOpen(true);
    }
  }

  // handle for closing user form dialog
  const handleClose = () => {
    setOpen(false);
  }

  // handle for open delete dialog
  const handleClickOpen = (value) => {
    setOpenDelete(true);
    setUserDetails(value);
  };

  // handle for deleting dialog
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // handle for deleting all the users
  const handleDeleteAll = () => {
    const deleteUsers = {
      ids: selected,
      delete: true
    }
    deleteAllUsers(deleteUsers, 'multi');
  }


  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MainCard title="Users" secondary={
          <Button variant="contained" color="primary" onClick={handleCreate}>Add User</Button>
        }>
          <EnhancedTableToolbar numSelected={selected.length} autocomplete={autocomplete} handleChangeData={handleChangeData} handleDeleteAll={handleDeleteAll} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.length > 0 && stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const isRowDisabled = row.delete === true;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        className={isRowDisabled ? classes.disabledRow : null}
                      >
                        <TableCell padding="checkbox" onClick={(event) => handleClick(event, row._id)}>
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.uniqueId}
                        </TableCell>
                        <TableCell align="left">{`${row.firstName} ${row.lastName}`}</TableCell>
                        <TableCell align="left">{formateDate(row.selectedDate)}</TableCell>
                        <TableCell align="left">{row.gender}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.fullAddress}</TableCell>
                        <TableCell align="left">{row.phoneNumber}</TableCell>
                        <TableCell align="left" style={{ color: row.status === 'Active' ? 'green' : 'red' }}>{row.status}</TableCell>
                        <TableCell align="left">
                          <Tooltip title="Edit">
                            <IconButton aria-label="edit" size='small' onClick={() => handleCreate(row, 'edit')}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Tooltip title="Delete">
                            <IconButton aria-label="delete" size='small' onClick={() => handleClickOpen(row)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </MainCard>
        <AddUser
          open={open}
          handleClose={handleClose}
          isEditMode={isEditMode}
          initialValues={userDetails}
        />
        <DeleteUser
          openDelete={openDelete}
          initialValues={userDetails}
          handleCloseDelete={handleCloseDelete}
        />
      </Container>
    </>
  )
}

export default Users