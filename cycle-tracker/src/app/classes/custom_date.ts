import { MatLuxonDateModule } from "@angular/material-luxon-adapter";

export class CustomDateAdapter extends MatLuxonDateModule{
    getFirstDayOfWeek(): number {
        return 1;
    }

    

}
