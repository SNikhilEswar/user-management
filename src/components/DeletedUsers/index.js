import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// material-ui
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, Button, Checkbox, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Typography, TextField, Container, Backdrop, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

// project imports
import MainCard from '../../customs/MainCard';
import { useApi } from '../Users/ApiContext';
import Navbar from '../Nav';

// heading array for table heading
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

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;
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
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align={'right'}>Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
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
  const { numSelected, jobids, setJobids, autocomplete, handleChangeData, enableAll } = props;



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
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

        </Typography>
      )}

      {numSelected > 0 ? (
        <Button variant="contained" color="primary" size="small" onClick={enableAll} style={{ width: '12%', height: 45 }}>
          Enable multi
        </Button>
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));


// Render the component with Material-UI components
const DeletedUsers = () => {

  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [jobids, setJobids] = React.useState('');

  // imported hook with contextApi
  const { rows, deletedFetchData, autocomplete, fetchSingleData, selected, setSelected, deleteAllUsers, formateDate, loading, error } = useApi();

  // Handle selecting all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
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
      deletedFetchData();
    } else {
      fetchSingleData(value._id);
    }
  }

  // Enable all selected deleted users
  const enableAllDeleted = () => {
    const enableValues = {
      ids: selected,
      delete: false
    }
    deleteAllUsers(enableValues, 'enableAll')
  }

  // Enable a single deleted user
  const enableSingleDelete = (id) => {
    const deleteData = { "ids": [id], "delete": false }
    deleteAllUsers(deleteData, 'enableSingle')
  }

  // Fetch deleted users on component mount
  React.useEffect(() => {
    deletedFetchData();
  }, []);




  // Render the component with the Material-UI components
  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <MainCard title="Deleted Users">
          <EnhancedTableToolbar numSelected={selected.length} setJobids={setJobids} jobids={jobids} autocomplete={autocomplete} handleChangeData={handleChangeData} enableAll={enableAllDeleted} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'medium'}
              aria-label="enhanced table"
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < rows.length}
                      checked={rows.length > 0 && selected.length === rows.length}
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                  </TableCell>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">DOB</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Address</TableCell>
                  <TableCell align="left">Mobile</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  <>
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
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
                            <TableCell align="left">{row.status}</TableCell>
                            <TableCell align="left">
                              <Button variant="outlined" color="primary" size="small" onClick={() => enableSingleDelete(row._id)}>
                                Enable
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </>
                ) :
                  <TableRow style={{ height: 53 * (rowsPerPage - 1) }}>
                    <TableCell colSpan={headCells.length + 2} align="center">
                      <h2>No deleted users found</h2>
                    </TableCell>
                  </TableRow>
                }
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
      </Container>
    </>
  );
};

export default DeletedUsers;
