import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'edit-profile',
        component: EditProfileComponent
    },
    {
        path: 'recommendation',
        component: RecommendationComponent
    },
    { path: '**', redirectTo: 'sign-up' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
