import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Welcome to the Java Profile Quiz.");
        System.out.println("Answer a few questions and I will build a profile for you.");
        System.out.println();

        System.out.print("What is your name? ");
        String name = scanner.nextLine();
        System.out.print("What is your favourite food? ");
        String food = scanner.nextLine();
        System.out.print("What is your favourite colour? ");
        String colour = scanner.nextLine();
        System.out.print("What do you want to build one day? ");
        String goal = scanner.nextLine();
        System.out.print("Do you like Java? ");
        String likesJava = scanner.nextLine();

        if (likesJava.equals("yes")) {
            System.out.println("Great. Java can help you build many kinds of programs.");
        } else {
            System.out.println("No problem. Practice still helps.");
        }

        String[] interests = {"coding", "music", "games"};

        System.out.println();
        System.out.println("Profile Summary");
        System.out.println("---------------");
        System.out.println("Name: " + name);
        System.out.println("Favourite food: " + food);
        System.out.println("Favourite colour: " + colour);
        System.out.println("Goal: " + goal);
        System.out.println();
        System.out.println("Starter interests:");
        for (String interest : interests) {
            System.out.println("- " + interest);
        }

        scanner.close();
    }
}
