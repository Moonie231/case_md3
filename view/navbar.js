const navbar = `
<nav class="navbar navbar-expand-sm navbar-dark" style="background-color: blue;">
<a class="navbar-brand" href="#">Hotel</a>
<button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId"
        aria-expanded="false" aria-label="Toggle navigation"></button>
<div class="collapse navbar-collapse" id="collapsibleNavId">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
            <a class="nav-link" href="/room">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/room/add">Add</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/static">Static</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="/user" id="dropdownId" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">User</a>
            <div class="dropdown-menu" aria-labelledby="dropdownId">
                <a class="dropdown-item" href="/user/edit-info">Edit Info</a>
                <a class="dropdown-item" href="/user/change-password">Change Password</a>
                <a class="dropdown-item" href="/user/logout">Log out</a>
            </div>
        </li>
    </ul>
</div>
</nav>
`;
module.exports = navbar;