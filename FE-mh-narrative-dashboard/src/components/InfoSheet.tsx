import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";

interface InfoSheetProps {
  onClick: () => void;
}


const InfoSheet: React.FC<InfoSheetProps> = (props) =>{
  const { onClick } = props;

  return (
    <div>
      test
      <Button onClick={onClick}>x</Button>
    </div>
  );
}

export default InfoSheet;