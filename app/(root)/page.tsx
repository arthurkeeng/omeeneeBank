import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

export default function RootPage(){
    const loggedIn = {firstName : 'Keeng' , lastName : 'Chima' ,email : "keengchima@gmail.com"}
    return <section className="home">
        <div className="home-content">
            <header className="home-header">
                <HeaderBox 
                type ='greeting' 
                title = 'welcome' 
                user ={loggedIn.firstName || "Guest"}
                subtext = 'Access and manage your accounts and transactions'
                /> 
                <TotalBalanceBox 
                accounts ={[]}
                totalBanks = {1}
                totalCurrentBalance = {1200.35}
                />
            </header>
            RECENT TRANSACTIONS
        </div>
        <RightSidebar
        user = {loggedIn}
        transaction = {[]}
        banks ={[{
            currentBalance : 123.56
        },{currentBalance : 200.56},{currentBalance : 560.30}]}
        />
    </section >
}