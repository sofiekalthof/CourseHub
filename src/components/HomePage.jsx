import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { Grid } from "@mui/material";

function HomePage(){
    return(
        <>
        <Grid container spacing={2} sx={{justifyContent:'center'}}>
            <Grid item xs={12}> 
                <Navbar/>
            </Grid>
            <Grid item xs={12}> 
                <SearchBar/>
            </Grid>
        </Grid>
        </>
    )
}
export default HomePage;