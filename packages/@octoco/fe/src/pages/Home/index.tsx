import React from 'react';
import { HomeWrapper } from './Home.styles';
import { Helmet } from 'react-helmet-async';
import { Button, Container } from '@mui/material';
import WelcomeComponent from './components/WelcomeComponent';
import { DataGrid } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from 'src/hooks/hooks';
import {
  addTradeGroups,
  selectTradeGroups,
} from 'src/store/trade-groups/tradeGroupsSlice';
import { TradeGroup } from '@octoco/shared';

const HomePage = () => {
  const dispatch = useAppDispatch();

  const tradeGroups: TradeGroup[] = useAppSelector(selectTradeGroups);
  const rows = tradeGroups.map((go) => {
    return { id: go.id, col1: go.id, col2: go.name };
  });
  const columns = [
    { field: 'col1', headerName: 'Id', width: 150 },
    { field: 'col2', headerName: 'Name', width: 50 },
  ];

  // A simple example of fetching data from the rest API.
  return (
    <HomeWrapper>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container maxWidth="lg">
        <WelcomeComponent />

        <Button
          onClick={async () => {
            try {
              // Create a grid operator:
              await fetch('http://localhost:8080/api/trade-group', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: '' + new Date().getSeconds(),
                }),
              });

              // Fetch the list of them:
              const res = await fetch('http://localhost:8080/api/trade-group');
              dispatch(
                addTradeGroups({
                  tradeGroups: await res.json(),
                })
              );
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Create random grid operator.
        </Button>

        <DataGrid rows={rows} columns={columns} />
      </Container>
    </HomeWrapper>
  );
};

export default HomePage;
